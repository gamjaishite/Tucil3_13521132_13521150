import {useState} from "react";
import SwitchComponent from "./switch";

export default function SwitchFile({
                                       setFile,
                                   }: {
    setFile: (x: boolean) => void;
}) {
    const [isChecked, setIsChecked] = useState(false)
    return (
        <SwitchComponent isChecked={isChecked} setIsChecked={(value) => {
            setFile(value)
            setIsChecked(value)
        }} label="File"/>
    );
}
