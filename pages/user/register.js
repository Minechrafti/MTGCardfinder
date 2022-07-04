/* eslint-disable react/react-in-jsx-scope */
import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/router";
import { register, login, createDeck } from "../../lib/api";

const defaultModel = {
    email: "",
    password: ""
};

function validateModel(user) {
    const errors = {
        email: "",
        password: ""
    };
    let isValid = true;

    if (user.email === "" || user.email === null) {
        errors.email = "Please enter a title";
        isValid = false;
    }

    if (user.password === "" || user.password === null) {
        errors.password = "pls enter a password";
        isValid = false;
    }

    return { errors, isValid };
}

export default function Register({ session }) {
    const [user, setUser] = useState(defaultModel);
    const router = useRouter();
    const [errors, setErrors] = useState(defaultModel);


    const handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;

        setUser({
            ...user,
            [name]: value,
        });
    };

    const submit = async (e) => {
        e.preventDefault();

        setErrors(defaultModel);

        const result = validateModel(user);

        if (!result.isValid) {
            setErrors(result.errors);
            return;
        }

        // eslint-disable-next-line no-unused-vars
        const newUser = await register(
            user.email,
            user.password,
        );
        const loginNewUser = await login(user);
        console.log(loginNewUser);
        let uId = loginNewUser.user.id;
        session.login(loginNewUser);

        function sleep(delay) {
          return new Promise((r) => setTimeout(r, delay));
        }
        sleep(2000);
        console.log(uId);
         sleep(5000);


        alert(uId)
        await createDeck(uId, "Wishlist");

        router.push("/");
    };


    return (
        <div>
            <h1>Register</h1>

            <Form onSubmit={submit}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>E-Mail</Form.Label>
                    <Form.Control type="email" name="email" onChange={handleChange} />
                    {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        onChange={handleChange}
                    />
                    {errors.password && (
                        <div style={{ color: "red" }}>{errors.password}</div>
                    )}
                </Form.Group>
                <Button variant="primary" type="submit">
          Save
                </Button>
                <Button onClick={() => router.push("/login")}>Back</Button>
            </Form>
        </div>
    );
}
