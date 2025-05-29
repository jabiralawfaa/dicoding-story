const createStoryItemTemplate = (story) => `
  <div class="story-item" role="article" aria-labelledby="title-${story.id}">
    <div class="story-item__header">
      <img class="story-item__image" src="${story.photoUrl}" alt="${story.name}" aria-describedby="desc-${story.id}">
    </div>
    <div class="story-item__content">
      <h2 class="story-item__title" id="title-${story.id}">
        <a href="#/detail/${story.id}" aria-label="Lihat detail cerita dari ${story.name}">${story.name}</a>
      </h2>
      <p class="story-item__date">${new Date(story.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <p class="story-item__description" id="desc-${story.id}">${story.description}</p>
    </div>
  </div>
`;

const createStoryDetailTemplate = (story) => `
  <div class="story-detail" role="article" aria-labelledby="detail-title">
    <h2 class="story-detail__title" id="detail-title" tabindex="-1">${story.name}</h2>
    <p class="story-detail__date">${new Date(story.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    
    <img class="story-detail__image" src="${story.photoUrl}" alt="Foto cerita: ${story.name}">
    
    <div class="story-detail__content">
      <p class="story-detail__description" id="detail-description">${story.description}</p>
    </div>
    
    ${story.lat && story.lon ? `<div id="detail-map" class="story-detail__map" tabindex="0" role="application" aria-label="Peta lokasi cerita"></div>` : ''}
  </div>
`;

export { createStoryItemTemplate, createStoryDetailTemplate };