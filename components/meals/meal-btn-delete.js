"use client"


import {removeMeal} from "@/lib/actions";


export default function MealBtnDelete({slug}) {
    const deleteMeal = async () => {
        await removeMeal(slug)
    }


    return (
        <button onClick={deleteMeal}>Delete</button>
    )
}