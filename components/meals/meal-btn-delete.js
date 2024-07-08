"use client"
import {removeMeal} from "@/lib/actions";

import classes from './meal-btn-delete.module.css';


export default function MealBtnDelete({slug}) {
    const deleteMeal = async () => {
        await removeMeal(slug)
    }


    return (
        <button onClick={deleteMeal} className={classes.wrap}>X</button>
    )
}