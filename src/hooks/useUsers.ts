import {useCollection} from "react-firebase-hooks/firestore";
import {db} from "../firebase";
import firebase from "firebase/app";

export default function useUsers(user: firebase.User) {
    const [ snapshot ] = useCollection(
        db.collection('users').orderBy('timestamp', 'desc')
    )

    const users: { id: string; userID: string; }[] = []

    if(user) {
        snapshot?.docs.forEach(doc => {
            const id = doc.id > user.uid ? `${doc.id}${user.uid}` :
                `${user.uid}${doc.id}`

            if(doc.id !== user.uid) {
                users.push({
                    id,
                    userID: doc.id,
                    ...doc.data()
                })
            }
        })
    }

    return users
}
