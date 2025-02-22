import { allowMethods } from '~/utils/response.server';
import type { Route } from './+types/example-form';
import { Form, Link, redirect, useActionData, useNavigate } from 'react-router';
import { AuthenticityTokenInput } from 'remix-utils/csrf/react';
import { validateCSRFToken } from '~/utils/csrf.server';
import { checkHoneypot } from '~/utils/honeypot.server';
import { HoneypotInputs } from 'remix-utils/honeypot/react';
import { z } from 'zod';
import { parseWithZod, getZodConstraint } from '@conform-to/zod';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';

const ExampleFormSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Required' })
        .max(30, { message: 'Cannot be over 30 characters' }),
});
const parseForm = (formData: FormData) =>
    parseWithZod(formData, { schema: ExampleFormSchema });

type ActionData = ReturnType<ReturnType<typeof parseForm>['reply']>;
export async function action({ request }: Route.ActionArgs) {
    await validateCSRFToken(request);
    allowMethods(request, ['POST']);

    const formData = await request.formData();
    await checkHoneypot(formData);

    const submission = parseForm(formData);
    if (submission.status !== 'success') {
        return submission.reply();
    }

    /* It is also allowed to reply with form errors */
    // if (submission.value.name === 'Invalid') {
    //     return submission.reply({
    //         formErrors: ['Got invalid name, please try another name']
    //     });
    // }

    globalThis.__name = submission.value.name;

    return redirect('/');
}

export default function Page() {
    const navigate = useNavigate();
    const actionData = useActionData<ActionData>();

    const [form, fields] = useForm({
        id: 'example-form',
        constraint: getZodConstraint(ExampleFormSchema),
        lastResult: actionData,
        onValidate({ formData }) {
            return parseForm(formData);
        },

        /* Useful Optional Conform Configurations */
        // shouldValidate: 'onBlur',
        // shouldRevalidate: 'onInput'
        // defaultValue: {}
    });

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center">
            <h1 className="pb-4 text-xl">
                Exmaple Form in Remix / React Router v7
            </h1>

            <Form
                method="POST"
                className="flex flex-row gap-3 items-center"
                {...getFormProps(form)}
            >
                <HoneypotInputs label="Please leave this field blank" />
                <AuthenticityTokenInput />

                <label htmlFor="name" className="py-2">
                    Your Name Is
                </label>
                <div className="relative">
                    <input
                        autoFocus
                        className="bg-blue-200 text-gray-700 px-2 py-2 rounded-md w-60"
                        {...getInputProps(fields.name, { type: 'text' })}
                    />
                    <p
                        id={fields.name.errorId}
                        className="absolute left-2 top-100% text-sm text-red-300 mt-1"
                    >
                        {fields.name.errors?.join(', ')}
                    </p>
                </div>

                <input
                    type="submit"
                    value="Submit"
                    name="intent"
                    className="text-sm bg-blue-700 px-4 py-2 rounded-md cursor-pointer"
                />
                <button
                    type="button"
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
        <div className="w-screen h-screen flex flex-col justify-center items-center gap-2 bg-red-900">
            <h1 className="text-4xl mb-4">😨 Something Went Wrong! 😨</h1>
            <p>🤔 It seems like form cannot be processed successfully. 🤔</p>
            <p>🤨 Did you try to do something bad...? 🤨</p>

            <Link
                to={{ pathname: '/' }}
                className="bg-white hover:bg-red-300 focus:bg-red-100 text-red-700 px-4 py-2 rounded-md mt-4"
            >
                Go Back
            </Link>
        </div>
    );
}
