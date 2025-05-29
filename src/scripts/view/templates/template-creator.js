const createStoryItemTemplate = (story) => `
  <div class="story-item">
    <div class="story-item__header">
      <img class="story-item__image" src="${story.photoUrl}" alt="${story.name}">
    </div>
    <div class="story-item__content">
      <h3 class="story-item__title">
        <a href="#/detail/${story.id}">${story.name}</a>
      </h3>
      <p class="story-item__date">${new Date(story.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <p class="story-item__description">${story.description}</p>
    </div>
  </div>
`;

const createStoryDetailTemplate = (story) => `
  <div class="story-detail">
    <h2 class="story-detail__title">${story.name}</h2>
    <p class="story-detail__date">${new Date(story.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    
    <img class="story-detail__image" src="${story.photoUrl}" alt="${story.name}">
    
    <div class="story-detail__content">
      <p class="story-detail__description">${story.description}</p>
    </div>
    
    ${story.lat && story.lon ? `<div id="detail-map" class="story-detail__map"></div>` : ''}
  </div>
`;

export default {
  createStoryItemTemplate,
  createStoryDetailTemplate,
};