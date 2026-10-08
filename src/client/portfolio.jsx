
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import WidgetDisplay from "./pfolioComponents/widgetDisplay.jsx";
import "./portfolio.css"
import PFolioNavBar from './pfolioComponents/navbar.jsx';
import usePortfolio from './pfolioComponents/usePortfolio.js';
import ProfileHeader from './pfolioComponents/profileHeader.jsx';
import PostGrid from './pfolioComponents/postGrid.jsx';
import PostFormModal from './pfolioComponents/postFormModal.jsx';
import defaultPfp from './assets/stockPhotoGuy.png';

function UserPortfolio(){

    const { uid } = useParams(); 
    const [data, setData] = useState([])
    const { posts, profile, isOwner, editMode, setEditMode, savePost, deletePost, saveProfile } = usePortfolio(uid)
    // null = closed, { post: null } = creating, { post } = editing that post
    const [modal, setModal] = useState(null)

    // on load, fetch the data with the id passed in the url
    useEffect(() => {
        fetch("/user/widgets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userid: uid
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setData(data);
        });
    }, []);

    return (
        <>
            <PFolioNavBar uid={uid}></PFolioNavBar>
            <ProfileHeader
                profile={profile}
                defaultPfp={defaultPfp}
                isOwner={isOwner}
                editMode={editMode}
                setEditMode={setEditMode}
                onNewPost={() => setModal({ post: null })}
                onSaveProfile={saveProfile}
            />
            <div className='postContainer'>
                <PostGrid
                    posts={posts}
                    editable={isOwner && editMode}
                    emptyMessage={isOwner ? 'No posts yet. Use "+ New post" to add your first piece.' : 'No work posted yet.'}
                    onEdit={(post) => setModal({ post })}
                    onDelete={deletePost}
                />

                {/* <div>{uid}</div>
                <WidgetDisplay widgets={data} /> */}
            </div>
            {isOwner && (
                <PostFormModal
                    show={modal !== null}
                    post={modal?.post ?? null}
                    onHide={() => setModal(null)}
                    onSave={async (fields) => { await savePost(modal?.post, fields); setModal(null); }}
                />
            )}
            
        </>
    );
}
export default UserPortfolio;