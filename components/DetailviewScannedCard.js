import {useEffect, useState} from 'react'
import { useRouter } from "next/router"
import {getCardbyName} from './../lib/api'

export default function DetailviewScannedCard({cardName}) {

    const router = useRouter()
    const [card, setCard] = useState()
    
    useEffect(() =>{
        if(cardName === '' || cardName === undefined || cardName === null)return
        // alert(cardName)
        async function getCardbyNameTmp(){
            let cardNametmp = cardName.trim()
            const cardTmp = await getCardbyName(cardNametmp);
            if(cardTmp !== undefined || cardTmp !== null){
              if (cardTmp.name.includes("//")) setCard(cardTmp.card_faces[0]);
              else setCard(cardTmp);
            }else router.push('/error/404')
        }
        getCardbyNameTmp()
    },[cardName])

    useEffect(() => {
        if(card !== undefined)router.push('/card/' + card.name)
    },[card])
    
    return(
        <div>
        </div>
    )
}