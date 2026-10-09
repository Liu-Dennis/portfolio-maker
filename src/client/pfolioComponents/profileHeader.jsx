import { useState, useEffect } from "react";
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import "./profileHeader.css";

// Top strip of a portfolio: picture, name, bio, and (owner only) the edit buttons.
// In edit mode the picture URL and bio become inputs in place; "Save profile" saves both.
function ProfileHeader({ profile, defaultPfp, isOwner, editMode, setEditMode, onNewPost, onSaveProfile }) {
    const [avatarUrl, setAvatarUrl] = useState("");
    const [bio, setBio] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null); // { ok, text }

    // keep the drafts in sync when the profile loads or is saved
    useEffect(() => {
        setAvatarUrl(profile?.avatarUrl ?? "");
        setBio(profile?.bio ?? "");
    }, [profile?.avatarUrl, profile?.bio]);

    const editing = isOwner && editMode;
    const changed = profile && (avatarUrl !== profile.avatarUrl || bio !== profile.bio);

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            await onSaveProfile({ avatarUrl, bio });
            setMessage({ ok: true, text: "Profile saved" });
        } catch (err) {
            setMessage({ ok: false, text: err.message });
        } finally {
            setSaving(false);
        }
    };

    // while editing, preview the draft picture; otherwise show the saved one
    const shownPfp = (editing ? avatarUrl : profile?.avatarUrl) || defaultPfp;

    return (
        <header className="profileHeader">
            <div className="profileHeaderPfp">
                <img src={shownPfp} alt="Profile picture" />
                {editing && (
                    <Form.Control
                        size="sm"
                        type="url"
                        placeholder="Picture URL (https://...)"
                        aria-label="Profile picture URL"
                        value={avatarUrl}
                        onChange={e => setAvatarUrl(e.target.value)}
                    />
                )}
            </div>

            <div className="profileHeaderText">
                <h1 className="profileHeaderName">{profile?.username}</h1>
                {editing ? (
                    <>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            maxLength={1000}
                            placeholder="Write a short bio"
                            aria-label="Bio"
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                        />
                        <Form.Text muted>{bio.length}/1000</Form.Text>
                    </>
                ) : (
                    <p className="profileHeaderBio">{profile?.bio || "No bio yet."}</p>
                )}
            </div>

            {isOwner && (
                <div className="profileHeaderActions">
                    <ButtonGroup aria-label="Page mode">
                        <Button variant={editMode ? "primary" : "outline-primary"} onClick={() => setEditMode(true)}>Editing</Button>
                        <Button variant={editMode ? "outline-primary" : "primary"} onClick={() => setEditMode(false)}>Viewing</Button>
                    </ButtonGroup>
                    {editMode && (
                        <>
                            <Button onClick={onNewPost}>+ New post</Button>
                            <Button variant="primary" onClick={handleSave} disabled={!changed || saving}>
                                {saving ? "Saving..." : "Save profile"}
                            </Button>
                            {message && (
                                <small className={message.ok ? "text-success" : "text-danger"}>{message.text}</small>
                            )}
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
export default ProfileHeader;
