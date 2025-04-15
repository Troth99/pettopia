import { mainEl, render, html } from "../../../constants/constants.js";
import { getAllYokrshireTerier, getChihuahuaInfo } from "../../../services/breeds.js";
import { auth } from "../../../config/firebaseInit.js"; 
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../config/firebaseInit.js";

export default async function showChihuahuaView() {
    const chihuahua = await getChihuahuaInfo();
    render(chihuahuaTemplate(chihuahua), mainEl);
}

function chihuahuaTemplate(yorkshireTerier) {

    function translateCoatType(coatType) {
        const coatTypeTranslations = {
            short: "Късокосместа",
            long: "Дългокосместа",
            medium: "Средна дължина",
        };
        return coatTypeTranslations[coatType] || coatType;
    }


    function translateSize(size) {
        const sizeTranslations = {
            small: "Малък",
            medium: "Среден",
            large: "Голям",
        };
        return sizeTranslations[size] || size;
    }


    function translateEnergyLevel(energyLevel) {
        const energyLevelTranslations = {
            low: "Ниско",
            medium: "Средно",
            high: "Високо",
        };
        return energyLevelTranslations[energyLevel] || energyLevel;
    }


    async function deleteBreed(breedId) {
        if (confirm("Сигурни ли сте, че искате да изтриете този запис?")) {
            try {
               
                await deleteDoc(doc(db, "breeds", breedId));
                alert("Записът беше успешно изтрит!");
                location.reload(); 
            } catch (error) {
                console.error("Грешка при изтриването на запис:", error);
                alert("Не успяхме да изтрием записа.");
            }
        }
    }

    return html`
        <section class="chihuahua-info">
            <h2>Чихуахуа</h2>

            ${yorkshireTerier.length === 0
                ? html`<p class="no-data">Няма налични Йоркширски териери за осиновяване в момента. </p>`
                : yorkshireTerier.map(
                      (breed) => html`
                          <div class="breed-card">
                              <img src="${breed.image}" class="breed-image" />
                              <div class="breed-details">
                                  <p><strong>Описание:</strong> ${breed.description}</p>
                                  <p><strong>Размер:</strong> ${translateSize(breed.size)}</p>
                                  <p><strong>Темперамент:</strong> ${breed.temperament}</p>
                                  <p><strong>Тегло:</strong> ${breed.weight}</p>
                                  <p><strong>Височина:</strong> ${breed.height}</p>
                                  <p><strong>Тип козина:</strong> ${translateCoatType(breed.coatType)}</p>
                                  <p><strong>Продължителност на живота:</strong> ${breed.lifespan}</p>
                                  <p><strong>Произход:</strong> ${breed.origin}</p>
                                  <p><strong>Ниво на енергия:</strong> ${translateEnergyLevel(breed.energyLevel)}</p>
                                  <p><strong>Здравословни проблеми:</strong> ${breed.healthIssues}</p>
                              </div>
                              <div class="adoption-link">
                                  <a href="/adopt/${breed.id}" class="adopt-button">Попълнете формуляр за осиновяване</a>
                                  ${auth.currentUser?.email === 'troth@abv.bg'
                                      ? html`
                                            <button class="delete-button" @click="${() => deleteBreed(breed.id)}">Изтрий</button>
                                        `
                                      : ''}
                              </div>
                          </div>
                      `
                  )}
        </section>
    `;
}

