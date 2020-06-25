import fetch from 'isomorphic-unfetch';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Confirm, Loader } from 'semantic-ui-react';

const Note = ({ note }) => {
    const [confirm, setConfirm] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isDeleted) {
            deleteNote();
        }
    }, [isDeleted])

    const open = () => setConfirm(true);

    const close = () => setConfirm(false);

    const handleDelete = async () => {
        setIsDeleted(true);
        close();
    }

    const deleteNote = async () => {
        const noteId = router.query.id;
        try {
            const deleted = await fetch(`http://localhost:3000/api/notes/${noteId}`, {
                method: 'Delete',
            })
            router.push("/")
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="note-container">
            {
                isDeleted || !note
                    ? <Loader active />
                    :
                    <>
                        <h1>{note.title}</h1>
                        <p>{note.description}</p>
                        <Button onClick={open} color="red">Delete</Button>
                    </>
            }
            <Confirm
                open={confirm}
                onCancel={close}
                onConfirm={handleDelete}
            />
        </div>
    )
}


Note.getInitialProps = async ({ query: { id } }) => {
    const res = await fetch(`http://localhost:3000/api/notes/${id}`);
    const { data } = await res.json();

    return { note: data }
}


export default Note;