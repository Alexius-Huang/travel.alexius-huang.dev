import { allowMethods } from "~/utils/response";
import type { Route } from "./+types/test-form";
import { Form, redirect } from "react-router";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import { validateCSRFToken } from "~/utils/csrf.server";

export async function action({ request }: Route.ActionArgs) {
    await validateCSRFToken(request);
    allowMethods(request, ["POST"]);

    const formData = await request.formData();
    const name = formData.get('name');

    console.log(`User name is: ${name}`);

	return redirect('/');
}

export default function Page() {
    return (
        <div>
            <h1>Test Form</h1>
            <Form method="POST">
                <AuthenticityTokenInput />

                <label>
                    Name:
                    <input className="bg-white text-black" type="text" name="name" />
                </label>
                <input type="submit" value="Submit" />
            </Form>
        </div>
    );
}

export function ErrorBoundary(error: Route.ErrorBoundaryProps) {
    console.error(error);
    return (
        <div>Error Processing Form</div>
    );
}