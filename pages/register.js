import { useState } from "react"
import { register } from "../lib/api"


export default function Register() {

    const [data, setData] = useState({ "email": "", "password": "" })

    const onChange = (e) => {
        let value = e.target.value;
        let name = e.target.name;
        setData({
            ...data,
            [name]: value
        });
    }

    function submit() {
        register(data.name, data.password)
    }

    return (
        <div>
            <input onChange={(e) => onChange(e)} name="email" type="text" />
            <input onChange={(e) => onChange(e)} name="password" type="password" />
            <button onClick={() => submit()}>submit</button>
        </div>
    )
}