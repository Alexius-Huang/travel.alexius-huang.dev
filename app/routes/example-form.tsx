import { allowMethods } from "~/utils/response";
import type { Route } from "./+types/example-form";
import { Form, Link, redirect, useNavigate } from "react-router";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import { validateCSRFToken } from "~/utils/csrf.server";
import { checkHoneypot } from "~/utils/honeypot.server";
import { HoneypotInputs } from "remix-utils/honeypot/react";

export async function action({ request }: Route.ActionArgs) {
    await validateCSRFToken(request);
    allowMethods(request, ["POST"]);

    const formData = await request.formData();
    await checkHoneypot(formData);

    const name = formData.get('name');
    /* TODO: use Zod Schema */

    globalThis.__name = name as string;

	return redirect('/');
}

export default function Page() {
    const navigate = useNavigate();

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center">
            <h1 className="pb-4 text-xl">Exmaple Form in Remix / React Router v7</h1>
            <Form method="POST" className="flex flex-row gap-3 items-center">
                <HoneypotInputs label="Please leave this field blank" />
                <AuthenticityTokenInput />

                <label htmlFor="name">
                    Your Name Is
                </label>
                <input
                    id='name'
                    className="bg-blue-200 text-gray-700 px-2 py-1 rounded-md"
                    type="text"
                    name="name"
                />
                <input
                    type="submit"
                    value="Submit"
                    className="text-sm bg-blue-700 px-4 py-2 rounded-md cursor-pointer"
                />
                <button
                    className="text-sm bg-red-700 px-4 py-2 rounded-md cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>
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