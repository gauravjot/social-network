import React, {Component, useState} from 'react'

import InputField from '../../utils/InputField'

function SignUp() {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirthday] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(true);

    const handleSignUp = () => {
        console.log(first_name);
        console.log(last_name);
        console.log(email);
        console.log(password);
        console.log(confirmPassword)
        console.log(birthday);
      };

    const handleFirstName = ({ target }) => {
        setFirstName(target.value);
    };

    const handleLastName = ({ target }) => {
        setLastName(target.value);
    };

    const handleEmail = ({ target }) => {
        setEmail(target.value);
    };

    const handlePassword = ({ target }) => {
        setPassword(target.value);
    };

    const handleConfirmPassword = ({ target }) => {
        if (password === target.value) {
            setConfirmPassword(true)
        }
        else { setConfirmPassword(false) }
    };

    const handleBirthday = ({ target }) => {
        setBirthday(target.value);
    };


    return (
        <div>
            <div className="mx-4 mt-5 fs-3 p-2">
                <span>Join Us Now!</span>
            </div>
            <div className="mb-4 p-2 mx-4">
                <span>Already a member? <a href="#" className="text-decoration-none">Sign in</a></span>
            </div>
            <div className="row g-3 mb-5 mx-4">
                <div className="col-12">
                    <span className="text-sm text-muted">All fields are mandatory.</span>
                </div>
                <div className="col-md-6">
                    <InputField
                        label="First Name:"
                        onChange={handleFirstName}
                        name="first_name"
                        type="text" />
                </div>
                <div className="col-md-6">
                    <InputField
                        label="Last Name:"
                        onChange={handleLastName}
                        name="last_name"
                        type="text" />
                </div>
                <div className="col-12">
                    <InputField
                        label="Email:"
                        onChange={handleEmail}
                        name="email"
                        type="email"
                        placeholder="you@company.com" />
                </div>
                <div className="col-md-6">
                    <InputField
                        label="Password:"
                        onChange={handlePassword}
                        name="password"
                        type="password" />
                </div>
                <div className="col-md-6">
                    <div className={confirmPassword ? '' : 'error-bg'}>
                        <InputField
                            label="Confirm Password:"
                            onChange={handleConfirmPassword}
                            name="confirm_password"
                            type="password" />
                    </div>
                </div>
                <div className="col-12">
                    <InputField
                        label="Birthday:"
                        onChange={handleBirthday}
                        name="birthday"
                        type="text"
                        placeholder="MM-DD-YYYY" />
                </div>
                <div className="col-12">
                    <div className="p-2"></div>
                    <div className="d-grid gap-2">
                        <button type="submit" onClick={handleSignUp} className="btn btn-primary text-sm fw-bold py-3">Let's Go!</button>
                    </div>
                </div>
            </div>
            <br/>
            <div className="text-muted text-sm tos-text-signup py-3">
                By clicking the button above, you agree to our <a href="#" className="text-decoration-none">terms of use</a> and <a href="#" className="text-decoration-none">privacy policies</a>
            </div>
        </div>
        );
}

export default SignUp;