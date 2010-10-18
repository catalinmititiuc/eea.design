from Products.CMFCore.utils import getToolByName
from Products.Five import BrowserView

LABELS = {
    'climate change': 'Climate Change',
    'nature and biodiversity': 'Nature and biodiversity',
    'land use': 'Land use',
    'soil': 'Soil',
    'marine and coastal': 'Marine and coastal environment',
    'consumption': 'Consumption',
    'material resources, natural resources, waste': 'Material resources and waste',
    'freshwater quality, water resources': 'Freshwater',
    'air pollution': 'Air pollution',
    'urban environment': 'Urban environment',
    'global megatrends': 'Global megatrends',
}

class SoerTopicSearch(BrowserView):

    def getTopicLabel(self):
        tag = self.request.get('topic')
        return LABELS.get(tag, tag)

    def getSynthesisReport(self):
        tag = self.request.get('topic')
        return []

    def getThematicAssesments(self):
        tag = self.request.get('topic')
        return []

    def getGlobalMegatrends(self):
        tag = self.request.get('topic')
        return []

    def getCountryEnvironment(self):
        tag = self.request.get('topic')
        ret = []
        countries = getattr(self.context, 'countries', None)
        if countries != None:
            for brain in countries.getFolderContents()[:5]:
                ret.append({
                    'url': brain.getURL(),
                    'title': brain.Title,
                    'description': brain.Description,
                })
        return ret