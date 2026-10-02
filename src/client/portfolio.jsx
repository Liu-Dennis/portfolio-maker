
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import WidgetDisplay from "./pfolioComponents/widgetDisplay.jsx";
import "./portfolio.css"
import PFolioNavBar from './pfolioComponents/navbar.jsx';
import UserInfo from './pfolioComponents/userInfo.jsx';

function UserPortfolio(){

    const { uid } = useParams(); 
    const [data, setData] = useState([])

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
                </div>
                <div className='postContainer'>
                    <WidgetDisplay widgets_db={data} />
                </div>
            </div>
            
        </>
    );
}
export default UserPortfolio;