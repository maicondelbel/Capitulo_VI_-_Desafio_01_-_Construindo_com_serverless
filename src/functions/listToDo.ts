import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient"

export const handler: APIGatewayProxyHandler = async (event) => {

	const { userid: user_id } = event.pathParameters;

	const response = await document.scan({
		TableName: "to_do",
		FilterExpression: "user_id = :user_id",
		ExpressionAttributeValues: {
			":user_id": user_id
		}
	}).promise();

	if(!response.Items.length) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "User not found",
			}),
		};
	}

	const toDoItens = response.Items.map((item) => {
		const { id, title, user_id, done, deadline } = item;
		const dateFormated = new Date(deadline);

		return { id, title, user_id, done, deadline: dateFormated};
	});

	return {
		statusCode: 201,
		body: JSON.stringify(toDoItens)
	}

}