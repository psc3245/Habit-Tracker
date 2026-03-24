const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL;

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function compareNewAndOldInfo(user, userInfo) {
  const existingDob = user.date_of_birth
    ? user.date_of_birth.split("T")[0]
    : "";
  console.log("existingDob", existingDob);
  console.log("userInfo.dob", userInfo.dob);
  console.log(
    "full compare",
    user.username,
    userInfo.username,
    user.email,
    userInfo.email,
    user.first_name,
    userInfo.firstName,
    user.last_name,
    userInfo.lastName,
  );
  return (
    user.username === userInfo.username &&
    user.email === userInfo.email &&
    user.first_name === userInfo.firstName &&
    user.last_name === userInfo.lastName &&
    existingDob === userInfo.dob
  );
}

export async function updateUser(userInfo) {
  try {
    const current = await fetch(`${backend_base_url}/users/${userInfo.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!current.ok) throw new Error("Failed to fetch current user");
    const existingUser = await current.json();

    if (compareNewAndOldInfo(existingUser, userInfo)) {
      return existingUser;
    }

    const res = await fetch(`${backend_base_url}/users/${userInfo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: userInfo.username,
        email: userInfo.email,
        dob: userInfo.dob,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Backend error:", errText);
      throw new Error("Update user failed");
    }

    return await res.json();
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}
