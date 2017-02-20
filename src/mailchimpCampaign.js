export const createCampaignFactory = (httpClient, apiKey) => {
  const [, dc] = apiKey.split('-');
  const apiEndpoint = `https://user:${apiKey}@${dc}.api.mailchimp.com/3.0`;
  return (quote, links, campaignSettings) => {
    const createCampaignUrl = `${apiEndpoint}/campaigns`;
    const campaignData = {
      type: 'regular',
      recipients: {
        list_id: campaignSettings.listId,
      },
      settings: {
        subject_line: 'Some subject',
        title: 'Some title',
        from_name: 'from_name',
        reply_to: 'some_reply_to',
      },
    };

    return httpClient.post(createCampaignUrl, campaignData)
    .then((response) => {
      const campaignId = response.data.id;
      const createCampaignContentUrl = `${apiEndpoint}/campaigns/${campaignId}/content`;
      const contentData = {
        template: {
          id: campaignSettings.templateId,
          sections: {
            quote: quote.text,
            title: `Best 7 links of week #${campaignSettings.referenceTime.format('W')}, ${campaignSettings.referenceTime.format('YYYY')}`,
          },
        },
      };

      links.forEach((link, i) => {
        contentData.template.sections[`article_title_${i + 1}`] = link.title;
        contentData.template.sections[`article_description_${i + 1}`] = link.description;
      });

      return httpClient.put(createCampaignContentUrl, contentData);
    });
  };
};

export default {
  createCampaignFactory,
};
