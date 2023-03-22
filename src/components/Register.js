import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

import axios from '../api/axios';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
// must start with lower or uppcase letter then followed by 3-23 characters either lower/uppercase/number/underscore/hyphen

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
// at least one uppercase, lowercase, digit, 1 special character and 8-24 characters

const REGISTER_URL = "/register"; //endpt for registration in backend API

const Register = () => {
  const userRef = useRef(); // allows us to focus on user input when component loads
  const errRef = useRef(); // if error then focus on that so it can be read by screen reader (accessibility)

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // to set focus when component loads. sets focus on username input
    userRef.current.focus();
  }, []);

  useEffect(() => {
    // Applied to username (in dependency array). Where we validate the username.
    const result = USER_REGEX.test(user);
    // console.log(user);
    // console.log(result);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    //
    const result = PWD_REGEX.test(pwd);
    // console.log(result);
    // console.log(pwd);
    setValidPwd(result);

    const match = pwd === matchPwd; //compare passwords to return a boolean
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    // if user changes info of one of the dependencies then clear out the error message.
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    // Note: e passed in by default by form
    e.preventDefault();

    //if submit button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    //validate info in state of user and password again
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid entry");
      return;
    }

    // IF NO BACKEND WAS AVAILABLE CAN USE THIS
    // console.log(user, pwd);
    // setSuccess(true);

    try {
        const response = await axios.post(REGISTER_URL, JSON.stringify({ user, pwd }),
            {
                headers: { 'Content-Type': 'application/json'},
                withCredentials: true 
            }
        ); //await works due to handleSubmit being async
        console.log(response?.data); // would be response from server via axios
        console.log(response.accessToken); // backend could have accessToken 
        console.log(JSON.stringify(response));

        setSuccess(true);

        // clear input fields 
        setUser('');
        setPwd('');
        setMatchPwd('');

    } catch (err) {
        if (!err?.response) {
            setErrMsg('No server response');
        } else if (err.response?.status === 409) {
            setErrMsg('Username Taken');
        } else {
            setErrMsg('Registration Failed');
        }
        errRef.current.focus(); 
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1> Success! </h1>
          <p>
            <a href="#"> Sign In </a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errMsg" : "offscreen"}
            aria-live="assertive"
          >
            {" "}
            {errMsg}{" "}
          </p>
          {/* offscreen still accessible by screen readers. assertive useful for screen reading. */}

          <h1> Register </h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">
              Username:
              {/* if valid name then hide X. if user state doesnt exist also hide X. otherwise display it via className invalid */}
              <FontAwesomeIcon
                icon={faCheck}
                className={validName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validName || !user ? "hide" : "invalid"}
              />
            </label>

            <input
              type="text"
              id="username" // would match the htmlFor in label
              ref={userRef}
              autoComplete="off" // no previous values
              onChange={(e) => setUser(e.target.value)}
              required
              aria-invalid={validName ? "false" : "true"} // for accessibility. screen reader announces if form needs adjustment
              aria-describedby="uidnote" // for accessibility. lets us provide another element that describes input field. (screen reader reads label, then type of input and reads the ariavalid then finally to give a full description here)
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <p
              id="uidnote"
              className={
                userFocus && user && !validName ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters. <br />
              Must begin with a letter. <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>

            <label htmlFor="password">
              Password:
              <span className={validPwd ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validPwd || !pwd ? "hide" : "invalid"}>
                {/* if valid name then hide X. if user state doesnt exist also hide X. otherwise display it via className invalid */}
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              // no ref because don't want to set focus to this field when component loads.
              type="password"
              id="password" // would match the htmlFor in label
              onChange={(e) => setPwd(e.target.value)}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters. <br />
              Must include uppercase and lowercase letters, a number, and a
              special character. <br />
              Allowed special characters:
              <span aria-label="exclamation mark">!</span>
              {/* aria label allows screen reader to say each */}
              <span aria-label="at symbol">@</span>
              <span aria-label="hashtag">#</span>
              <span aria-label="dollar sign">$</span>
              <span aria-label="percent">%</span>
            </p>
            <label htmlFor="confirm_pwd">
              Confirm Password:
              <span className={validMatch && matchPwd ? "valid" : "hide"}>
                {/* matching password must have something in it (cannot be blank) */}
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>

            <button
              disabled={!validName || !validPwd || !validMatch ? true : false}
            >
              {" "}
              Sign Up
            </button>
            {/* Since only 1 button on this form:  no type=submit attribute needed because that is default  */}
          </form>
          <p>
            Already registered?
            <br />
            <span className="line">
              <Link to="/login"> Sign In </Link>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;
