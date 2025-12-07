---
title: "Bringing our Comic Relief Values to life with IoT and Serverless"
date: "2019-12-06"
---

Seven values, from "Break down Barriers", to "Have a sense of humour, always", together with a wish from our director Charlotte to bring our values to life, proved to be enough inspiration to spend a fun afternoon hacking together a live values dashboard.

The idea? Put an [Amazon Dash](https://www.amazon.co.uk/All-New-AWS-IoT-Enterprise-Button/dp/B075FPHHGG) button on each card, make people vote for the value they'll carry out throughout the day by pushing the button on the card when they enter the office, and display a live dashboard of "most voted values".

While our dashboard certainly piqued the interest of colleagues, ranging from "this is cool!", to mild curiosity, to "what the hell is this?", we really did this as a fun exercise in turning a simple idea into an actual scalable product in a short time frame and using our familiar serverless stack.

## Our tools

This is how we connected it all up:

- Seven [AWS IoT enterprise buttons](https://www.amazon.co.uk/All-New-AWS-IoT-Enterprise-Button/dp/B075FPHHGG) we purchased and registered to our AWS account, with each button associated to one of our seven values.
- A DynamoDB table to store all the votes
- [AWS AppSync](https://aws.amazon.com/appsync/), so we can use GraphQL to update our DynamoDB table and streams updates to the front-end using subscriptions
- A Lambda function which connects the IoT button click and runs a GraphQL mutation update DynamoDB
- A ReactJS front-end bootstrapped using create-react-app and using our Comic Relief component library.

## Real-time values dashboard

It takes approximate 3–4 seconds from button push to dashboard update, and most of that time is spent by the dash button connecting to the WiFi and sending the payload to the Lambda function, with <1sec to update DynamoDB and stream the updates to the front-end.

To get some insight into usage, we hooked it up to [Serverless dashboard](http://www.serverless.com) which will send out alerts to Slack when there is lots of activity.

## How we built it

We used [AWS Amplify](https://docs.aws.amazon.com/amplify/), and one of the things that surprised me most is the speed at which we got this all running.

First of all, let's initialise our app

```
# Create a new react app
npx create-react-app cr-values
cd cr-values

# Initialize amplify
amplify init
```

Now, adding a GraphQL API is as simple as

```
amplify add api
```

The only input you need to give is the GraphQL schema, which in our case was really simple. We associate a random ID with a buttonType (any of the seven values), a clickType (single click, double click or long click), and a timestamp.

```
type ButtonPush @model {
  id: ID!
  buttonType: String!
  clickType: String
  created: AWSTimestamp
}
```

Amplify automatically handles the entire API creation, and generates GraphQL queries, mutations and subscriptions you can use in your ReactJs front-end.

Now, we need to connect button pushes to a GraphQL mutation using Lambda. The event contains which button was pushed, and the clickType. We then send this to GraphQL using the aws-appsync SDK.

```javascript
const push = async (event, context) => {
  const { placementInfo, deviceEvent } = event;

  const mutation = gql`
    mutation createButtonPush {
      createButtonPush(input: {
        id: "${uuid()}",
        buttonType: "${placementInfo.attributes.buttonType}",
        clickType: "${deviceEvent.buttonClicked.clickType}",
        created: ${new Date().getTime()}
      }) {
          id
          buttonType
          clickType
          created
      }
    }
  `;

  await graphqlClient.mutate({ mutation });

  return {
    statusCode: 200,
    body: 'Button clicked',
  }),
};

export default push;
```

For our front-end, we have a simple React component which uses the `useEffect` hook to run a subscription operation and store button pushes using `useState` so we can re-render our component.

```javascript
const [newPushes, setNewPushes] = useState([]);

useEffect(() => {
  API.graphql(
    graphqlOperation(subscriptions.onCreateButtonPush)
  ).subscribe({
    next: (todoData) => setNewPushes(todoData.value.data.onCreateButtonPush)
  });
}, []);
```

The actual code is a little more complicated, as we use another effect to run GraphQL list operation to populate initial state, and re-render upon changes of the `newPushes`.

And that's all — we proved that with the right tooling it's incredibly quick to build something useable. We're excited about this tech stack (AWS Amplify is something I'll personally explore a lot more going forward) and will certainly do a few more iterations with our colleagues.

*Massive thanks to [Adam Clark](https://twitter.com/adamclark_dev) and [Gustavo Liedke](https://twitter.com/gusliedke) for building this together in an afternoon and learning from each other, and [Charlotte Hillenbrand](https://twitter.com/crashtherocks) for launching our Comic Relief values and providing us with the inspiration to build this.*
