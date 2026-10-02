
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import WidgetDisplay from "./pfolioComponents/widgetDisplay.jsx";
import "./portfolio.css"
import PFolioNavBar from './pfolioComponents/navbar.jsx';
import UserInfo from './pfolioComponents/userInfo.jsx';
import usePortfolio from './pfolioComponents/usePortfolio.js';
import EditSidebar from './pfolioComponents/editSidebar.jsx';
import PostGrid from './pfolioComponents/postGrid.jsx';
import PostFormModal from './pfolioComponents/postFormModal.jsx';

function UserPortfolio(){

    const { uid } = useParams(); 
    const [data, setData] = useState([])
    const { posts, isOwner, editMode, setEditMode, savePost, deletePost } = usePortfolio(uid)
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
            <div className='columnContainer'>
                <div className='infoEditContainer'>
                <UserInfo img="./assets/stockPhotoGuy.png" txt="Hello this is a bio"></UserInfo>
                {isOwner && (
                    <EditSidebar
                        postCount={posts.length}
                        editMode={editMode}
                        onToggleEditMode={() => setEditMode(m => !m)}
                        onNewPost={() => setModal({ post: null })}
                    />
                )}
                </div>
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