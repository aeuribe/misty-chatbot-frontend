import { useState } from "react";

const useDisableFields = () => {
    const [nameDisabled, setNameDisabled] = useState(false);
    const [emailDisabled, setEmailDisabled] = useState(false);

    const disableNameAndEmail = () => {
        setNameDisabled(true);
        setEmailDisabled(true);
    }

    return{
        nameDisabled,
        emailDisabled,
        disableNameAndEmail
    }
}

export default useDisableFields;