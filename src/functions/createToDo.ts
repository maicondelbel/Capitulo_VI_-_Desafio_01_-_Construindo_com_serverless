import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient"
import { v4 }  from "uuid";

interface ICreateToDo {
	title: string;
	deadline: Date;
}

export const handler: APIGatewayProxyHandler = async (event) => {

	const { userid: user_id } = event.pathParameters;
	const { title , deadline } = JSON.parse(event.body) as ICreateToDo;

	const id = v4();

	await document.put({
		TableName: "to_do",
		Item: {
			id,
			user_id,
			title,
			done: false,
			deadline: new Date(deadline).getTime(),
		}
	}).promise();

	return {
		statusCode: 201,
		body: JSON.stringify({
		  message: "Created successfully",
		}),
	  };

}