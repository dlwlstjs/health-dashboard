// app/components/SignupMessage.js
import React from "react";

const SignupMessage = ({ message, type }) => {
  return (
    <div className={`p-4 rounded ${type === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
      {message}
    </div>
  );
};

export default SignupMessage;
