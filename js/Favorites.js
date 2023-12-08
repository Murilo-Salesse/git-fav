import { GithubUser } from "./GithubUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector("#app");

    this.tbody = this.root.querySelector("table tbody");

    this.load();
  }

  load() {
    this.entries =
      JSON.parse(localStorage.getItem("@github-favorites-2:")) || [];
  }

  save() {
    localStorage.setItem("@github-favorites-2:", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username);
      if (userExists) {
        throw new Error("Usuário já cadastrado!!");
      }

      const user = await GithubUser.search(username);

      if (user.login === undefined) {
        throw new Error("Usuário não encontrado!!");
      }

      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.update();
    this.onadd();
  }

  onadd() {
    const addButon = this.root.querySelector("#add-user");

    addButon.onclick = () => {
      const { value } = this.root.querySelector("#github-user");

      this.add(value);
    };
  }

  update() {
    this.emptyState();
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.createRow();

      row.querySelector(
        ".users-wrappers img"
      ).src = `https://github.com/${user.login}.png`;
      row.querySelector(".users-wrappers img").alt = `Imagem de ${user.name}`;
      row.querySelector(".users-wrappers p").textContent = user.name;
      row.querySelector(
        ".users-wrappers a"
      ).href = `https://github.com/${user.login}`;
      row.querySelector(".users-wrappers span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;

      row.querySelector(".remove-user").onclick = () => {
        const isOk = confirm("Tem certeza que deseja remover este usuário?");

        if (isOk) {
          this.delete(user);
        }
      };

      this.tbody.append(row);
    });
  }

  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="users-wrappers">
        <img src="https://github.com/Murilo-Salesse.png" alt="imagem user">
        <a href="https://github.com/salessew">
          <p>Murilo Salesse</p>
          <span>/salessew</span>
        </a>
      </td>
      <td class="repositories">500</td>
      <td class="followers">600</td>
      <td><button class="remove-user">Remove</button></td>
    `;

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }

  emptyState() {
    if (this.entries.length === 0) {
      this.root.querySelector(".no-favorites").classList.remove("hide");
    } else {
      this.root.querySelector(".no-favorites").classList.add("hide");
    }
  }
}
