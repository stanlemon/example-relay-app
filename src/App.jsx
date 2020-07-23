import React from "react";
import { graphql, QueryRenderer, commitMutation } from "react-relay";
import { environment } from "./environment";

// Mutation for adding a new person to the database
// The mutation name must begin with 'App' because that's the name of the module and must end with 'Mutation'
const AppCreatePersonMutation = graphql`
  mutation AppCreatePersonMutation($input: CreatePersonInput!) {
    createPerson(input: $input) {
      person {
        id
        firstName
        lastName
      }
    }
  }
`;

// Once a mutation has been applied the local store that React is rendering off of needs to be updated
const updater = (store) => {
  // This is the initial query we loaded on initial render
  const allPeople = store.get("client:root");

  // This is the mutation we applied
  const payload = store.getRootField("createPerson");
  const newPerson = payload.getLinkedRecord("person");

  // From our initial query payload we'll grab nodes, which is where poerson records are stored
  const nodes = allPeople
    .getLinkedRecord("allPeople")
    .getLinkedRecords("nodes");

  // We are taking the existing person records and appending the new one to the end
  const newNodes = [...nodes, newPerson];

  // Now we are update the nodes property will the collection of original persons plus the new one we created
  allPeople.getLinkedRecord("allPeople").setLinkedRecords(newNodes, "nodes");
};

export class App extends React.Component {
  // Initial form state, all empty
  defaultState = {
    firstName: "",
    lastName: "",
  };

  // Copy our 'default' state into the actual default state, we do it this way so we can reference the
  // default state again after it changes from form entry
  state = Object.assign({}, this.defaultState);

  // Add a new person to the database
  addPerson = () => {
    // Only if we have actual form data
    if (!this.state || !this.state.firstName || !this.state.lastName) {
      return;
    }
    // Represent the data that will be passed into the graphql mutation
    const variables = {
      input: {
        person: this.state,
      },
    };

    // Reset our form so the fields are empty
    this.setState(Object.assign({}, this.defaultState));

    // Send the mutation, this will make the request that ultimately lands in the database
    commitMutation(environment, {
      mutation: AppCreatePersonMutation,
      variables,
      onCompleted: (response, errors) => {
        console.log("Response received from server.", response, errors);
      },
      onError: (err) => console.error("An error has occurred", err),
      // See the updater above, this is what causes the new state to appear in the UI
      updater,
    });
  };

  render() {
    // The query we will issue to load all of our existing persons from the database
    const query = graphql`
      query AppQuery {
        allPeople {
          nodes {
            id
            firstName
            lastName
          }
        }
      }
    `;

    return (
      <div key="root">
        <h1 key="header">People:</h1>
        <QueryRenderer
          environment={environment}
          query={query}
          render={({ error, props }) => {
            if (error) {
              return <div>Error!</div>;
            }
            if (!props) {
              return <div>Loading...</div>;
            }

            return (
              <div key="all">
                <ul key="list">
                  {props.allPeople.nodes.map((person) => (
                    <li key={person.id}>
                      {person.firstName} {person.lastName}
                    </li>
                  ))}
                </ul>
                <div key="container">
                  <input
                    placeholder="First Name"
                    key="firstName"
                    onChange={(e) =>
                      this.setState({ firstName: e.target.value })
                    }
                    value={this.state.firstName}
                  />
                  <input
                    placeholder="Last Name"
                    key="lastName"
                    value={this.state.lastName}
                    onChange={(e) =>
                      this.setState({ lastName: e.target.value })
                    }
                  />
                  <button key="add-button" onClick={this.addPerson}>
                    Add
                  </button>
                </div>
              </div>
            );
          }}
        />
      </div>
    );
  }
}
