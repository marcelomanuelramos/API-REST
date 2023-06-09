//  - ENTREGABLE 9/6 -
//  -API RESTPráctica de consumo de recursos a través de endpoints. Métodos GET, POST, PUT y DELETE.
//  -Utilizamos el backend de prueba de "https://mockapi.io" 

//------------------------------------------------------------------------------------------------------------------------------//

// FORM
const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);

//------------------------------------------------------------------------------------------------------------------------------//

//MODAL
const openModal = document.getElementById("open-modal");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
closeModal.addEventListener("click", () => {
    modal.close();
});

openModal.addEventListener("click", () => {
    modal.showModal();
});

let editUserId = null;
const listado = document.querySelector('#Tabla');
const URL_API = "https://647a6c1fd2e5b6101db05764.mockapi.io/users";

//------------------------------------------------------------------------------------------------------------------------------//

// GET ALL USERS
async function getAll(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        listado.innerHTML = '';

        data.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>
              <button class="remove-button" data-id="${user.id}">REMOVE</button>
              <button class="edit-button" data-id="${user.id}">EDIT</button>
            </td>
          `;
            const eliminarButton = row.querySelector(".remove-button");
            eliminarButton.addEventListener("click", () => {
                const userId = eliminarButton.getAttribute("data-id");
                deleteOne(userId);
            });

            const editarButton = row.querySelector(".edit-button");
            editarButton.addEventListener("click", () => {
                editUserId = editarButton.getAttribute("data-id");
                abrirModal(user);
            });

            listado.appendChild(row);
        });
    } catch (err) {
        console.error(err);
    }
}

//------------------------------------------------------------------------------------------------------------------------------//

// GET USER
async function getOne(id) {
    try {
        const response = await fetch(URL_API + `/${id}`);
        const data = await response.json();
    } catch (err) {
        console.error(err);
    }
}

getOne();

//------------------------------------------------------------------------------------------------------------------------------//

// REMOVE USER
async function deleteOne(id) {
    try {
        const response = await fetch(URL_API + `/${id}`, {
            method: "DELETE",
        });
        const data = await response.json();
        console.log(data);
        getAll(URL_API)
    } catch (err) {
        console.error(err);
    }
}

const newUser = {
    name: "Carl Jhonson",
    email: "CJventura@gmail.com",
    phone: "(2292) 721123",
};

//------------------------------------------------------------------------------------------------------------------------------//

// ADD USER
async function addOne(user) {
    try {
        const response = await fetch(URL_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        const data = await response.json();
        console.log(data);
        await getAll(URL_API)
        alert("Usuario agregado correctamente");

    } catch (err) {
        console.error(err);
    }
}

async function verificarExisteUsuario(user) {
    try {
        const response = await fetch(URL_API);
        const data = await response.json();

        const userExists = data.some(existingUser => existingUser.name === user.name);
        if (userExists) {
            alert("El usuario ya existe");
            return true;
        } else {
            addOne(user); 
            return false;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
}

const updatedUser = {
    name: "Carl Jhonson",
    email: "CJventura@gmail.com",
    phone: "(2292) 721123",
};

//------------------------------------------------------------------------------------------------------------------------------//

// UPDATE USER
async function updateOne(id, user) {
    try {
        const response = await fetch(URL_API + `/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        const data = await response.json();
        console.log(data);
        getAll(URL_API)
    } catch (err) {
        console.error(err);
    }
}

updateOne(70, updatedUser);

getAll(URL_API);

//------------------------------------------------------------------------------------------------------------------------------//

// FORM
async function handleSubmit(event) {
    event.preventDefault();

    const fullNameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");

    const user = {
        name: fullNameInput.value,
        email: emailInput.value,
        phone: phoneInput.value
    };

    try {
        if (editUserId) {
            await updateOne(editUserId, user); 
        } else {
            const exists = await verificarExisteUsuario(user); 
            if (!exists) {
                await addOne(user);
            }
        }

        modal.close();
        
        await getAll(URL_API);
    } catch (err) {
        console.error(err);
    }}

//------------------------------------------------------------------------------------------------------------------------------//

// OPEN MODAL
function abrirModal(user) {
    const fullNameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");

    const userToEdit = user;

    if (userToEdit) {
        fullNameInput.value = userToEdit.name;
        emailInput.value = userToEdit.email;
        phoneInput.value = userToEdit.phone;
    } else {
        fullNameInput.value = "";
        emailInput.value = "";
        phoneInput.value = "";
    }

    modal.showModal();
}
