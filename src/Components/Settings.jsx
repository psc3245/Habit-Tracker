import {useState, useEffect} from "react";


export default function Settings({user}) {


    return (<div>
        <form>
            <p>Display Mode</p>
            <select name="" id="">
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
            </select>
        </form>
    </div>);
}