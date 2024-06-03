import React, { useState, useEffect } from "react";
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";
import router from "next/router";

const CommentSection = () => {
    const [token, settoken] = useState("");
    useEffect(() => {
        const tokenvalue = localStorage.getItem("token");
        settoken(tokenvalue)
    }, []);

    const [id, setid] = useState("");

    useEffect(() => {
        const { id } = router.query;
        setid(id);
    }, [id]);

    const [allcomments, setallcomments] = useState([]);
    const [comment, setComment] = useState('');

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };


    useEffect(() => {
        if (id) {
            fetchBlog(id);
        }
    }, [id]);

    const fetchBlog = async (id) => {
        try {
            const res = await axios.get(`/api/${id}`);
            if (res.status === 200) {
                console.log(res)
                setallcomments(res.data.blogdet.comments)
            } else {
                console.log("Error fetching blog");
            }
        } catch (error) {
            console.log("Error fetching blog:", error);
        }
    };


    const handleSendClick = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`/api/comment/${id}`, {
                author: token,
                text: comment,
                blogid: id
            });
            setComment('');
        } catch (error) {
            console.log("Error:", error);
        }
    };


    return (
        <div style={commentSectionStyle}>
            <h2 style={commentSectionTitleStyle}>Comments</h2>
            <div style={commentListStyle}>
                {allcomments.map((comment, index) => (
                    <div key={index} style={commentStyle}>
                        <p style={commentAuthorStyle}>{comment.author}</p>
                        <p style={commentContentStyle}>{comment.createdAt.substring(0, 10)}</p>
                        <p style={commentContentStyle}>{comment.text}</p>
                    </div>
                ))}

            </div>
            <div style={commentInputStyle}>
                <input
                    type="text"
                    placeholder="Write a comment..."
                    style={inputFieldStyle}
                    value={comment}
                    onChange={handleCommentChange}
                />
                <SendIcon
                    style={{ color: comment ? '#03BDA1' : '#ccc', cursor: comment ? 'pointer' : 'not-allowed', marginLeft: '10px' }}
                    onClick={comment ? handleSendClick : null}
                />
            </div>
        </div>
    );
};
const commentSectionStyle = {
    marginTop: "40px",
    borderTop: "2px solid #ddd",
    paddingTop: "20px",
    background: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
};

const commentSectionTitleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#009781",
    marginBottom: "20px",
    textTransform: "uppercase",
    textAlign: "center",
};

const commentListStyle = {
    marginBottom: "20px",
};

const commentStyle = {
    marginBottom: "15px",
    padding: "15px",
    backgroundColor: "#ffffff",
    borderRadius: "5px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
};

const commentAuthorStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "5px",
};

const commentContentStyle = {
    fontSize: "16px",
    color: "#666",
};

const commentInputStyle = {
    display: "flex",
    alignItems: "flex-start",
    marginTop: "20px",
    padding: "10px 20px"
};

const inputFieldStyle = {
    flex: 1,
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
    color: "#333",
    fontFamily: 'Poppins, sans-serif',
    height: "100px"
};

export default CommentSection;
