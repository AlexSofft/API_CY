export const randomEmail = () => {
  return `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}@test.com`;
};


export const setAddBookRequestBody = (userID, isbn) => {
  return {
    "userId": `${userID}`,
    "collectionOfIsbns": [
      {
        "isbn": `${isbn}`
      }
    ]
  }
}

export const setChangeBookRequestBody = (userID, newisbn) => {
  return {
    "userId": `${userID}`,
    "isbn": `${newisbn}`
  }
}