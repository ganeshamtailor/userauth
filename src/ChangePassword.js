import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    // Get the username from session storage
    const username = sessionStorage.getItem("username");

    try {
      // Fetch the user data based on the username
      const response = await fetch(`http://localhost:8000/user?id=${username}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data.");
      }
      const data = await response.json();

      // Check if user data is found
      if (data.length > 0) {
        const user = data[0];

        console.log("currentPassword:", currentPassword);
        // Check if the current password matches
        if (user.password === currentPassword.trim()) {
          // Update the user's password
          const updateUserAPI = `http://localhost:8000/user/${user.id}`;

          const updatedUser = { ...user, password: newPassword };

          const updateResponse = await fetch(updateUserAPI, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
          });

          if (!updateResponse.ok) {
            throw new Error("Failed to update the password.");
          }

          // Clear the password fields
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");

          toast.success("Password changed successfully.");
          navigate("/");
        } else {
          toast.error("Current password is incorrect.");
        }
      } else {
        toast.error("User not found.");
      }
    } catch (error) {
      toast.error("Failed to change the password due to an error.");
      console.error(error);
    }
  };

  return (
    <div className="row">
      <div className="offset-lg-3 col-lg-6" style={{ marginTop: "100px" }}>
        <form onSubmit={handleSubmit} className="container">
          <div className="card">
            <div className="card-header">
              <h2>Change Password</h2>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => 
                    setCurrentPassword(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => 
                    setConfirmPassword(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
            </div>
            <div className="card-footer">
              <button type="submit" className="btn btn-primary">
                Change Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
