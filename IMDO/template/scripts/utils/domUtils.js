// rendera element i en container
export function renderElements(container, elements) {
    if (!container) {
        console.error("Container not found.");
        return;
    }

    // Filtrera bort null eller ogiltiga element innan vi renderar
    const validElements = elements.filter(element => element !== null);

    // Rensa containern innan nya kort läggs till
    container.innerHTML = ''; // Töm containern

    // Lägg till alla giltiga element i containern
    container.append(...validElements);
}
