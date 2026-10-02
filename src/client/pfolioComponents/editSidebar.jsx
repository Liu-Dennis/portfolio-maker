import { Button, Form } from 'react-bootstrap';
import "./editTools.css";

// Owner-only edit panel. Only rendered when the server says you own this page.
function EditSidebar({ postCount, editMode, onToggleEditMode, onNewPost }) {
    return (
        <aside className="editSidebar">
            <h2 className="h5">Edit your portfolio</h2>

            <Form.Check
                type="switch"
                id="edit-mode-switch"
                label={editMode ? "Editing" : "Previewing as a visitor"}
                checked={editMode}
                onChange={onToggleEditMode}
                className="mb-3"
            />

            {editMode && (
                <>
                    <h3 className="h6">Posts ({postCount})</h3>
                    <Button className="w-100" onClick={onNewPost}>+ New post</Button>
                    <Form.Text muted>Edit or delete a post with the buttons on each card.</Form.Text>
                </>
            )}
        </aside>
    );
}
export default EditSidebar;
