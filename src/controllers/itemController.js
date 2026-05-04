
const getItem = (req, res) => {
    res.status(200).json({
        message: "Berhasil mengambil data Item"
    })
}

const createItem = (req, res) => {
    res.status(200).json({
        message: "Berhasil membuat Item"
    })
}

const editItem = (req, res) => {
    res.status(200).json({
        message: "Berhasil mengedit Item"
    })
}

const deleteItem = (req, res) => {
    res.status(200).json({
        message: "Berhasil delete Item"
    })
}

export { getItem, createItem, editItem, deleteItem };