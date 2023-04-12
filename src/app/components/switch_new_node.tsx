import {useState} from "react";
import SwitchComponent from "./switch";

export default function SwitchNewNode({
                                          setNewNode,
                                      }: {
    setNewNode: (x: boolean) => void;
}) {
    const [isChecked, setIsChecked] = useState(true)
    return (
        <SwitchComponent isChecked={isChecked} setIsChecked={(value) => {
            setNewNode(value)
            setIsChecked(value)
        }} label="New Node"/>
    );
}
