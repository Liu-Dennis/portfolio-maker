
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import DemoWidget from "../widgets/DemoWidget.jsx";
import ImgCarousel from "../widgets/ImgCarousel.jsx";
import TextArticle from "../widgets/TextArticle.jsx";

function WidgetDisplay( {widgets_db} ){

    let widgets_list = widgets_db.map((entry) =>
        entry.widgets.map((widget, index) => {
            switch (widget.id) {
                case "widget_demo":
                    return <DemoWidget />
                case "article":
                    return <TextArticle title={widget.title} body={widget.body_text} />
                case "slideshow":
                    return <ImgCarousel title={widget.title} urls={widget.img_url} />
                // case "gallery":
                //     return <ImgGallery />
                default:
                    return null;
            }
        })
    )

    return (
        <div>
            {widgets_list}
        </div>
    );
}
export default WidgetDisplay;