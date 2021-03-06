""" Browser interfaces
"""
from plone.app.portlets.interfaces import IColumn
from plone.portlets.interfaces import IPortletManager
from plone.theme.interfaces import IDefaultPloneLayer
from zope.interface import Interface
from zope.viewlet.interfaces import IViewletManager


class IEEACommonLayer(Interface, IDefaultPloneLayer):
    """Common layer
    """


class IEEADesignPublic(IEEACommonLayer):
    """Marker interface that defines a common Zope 3 browser layer, which
    will contain resources specific for common theme use
    """


class IEEADesignCMS(IEEACommonLayer):
    """Marker interface that defines a Zope 3 browser layer, which
    will contain resources specific for CMS use
    """


class IFooterPortletManager(IPortletManager, IColumn):
    """we need our own portlet manager for the footer area.
    we also import Icolumn to get the portlets that are defined
    for the column area, otherwise we only get two portlets
    ( static and collection )
    """


class ISoerTopicSearch(Interface):
    """ Topic Search """

    def getTopicLabel():
        """ Label """

    def getSynthesisReport():
        """  Synthesis Report """

    def getThematicAssesments():
        """ Thematic Assesments """

    def getGlobalMegatrends():
        """ Global Megatrends """

    def getCountryEnvironment():
        """ Country Environment """


class ISoerFrontpage(Interface):
    """ Front page """

    def getKeyFacts():
        """ Key Facts """

    def getMessages():
        """ Messages """

    def getSoerTopics():
        """ Soer Topics """

    def getSoerLocations():
        """ Soer Locations """


class IFrontPageHighlights(Interface):
    """ Front Page Highlights """

    def getPromotions():
        """ Return all published promotions and group them in categories.
            Categories are defined by the folders containing the promotions. """

    def getHighArticles():
        """ Return the published articles with visibility `top` and that
            haven't expired. Sort by publish date and return the number
            that is configured in portal_properties.frontpage_properties.
        """

    def getMediumArticles():
        """ Return the published articles with visibility `middle` and that
            haven't expired. Sort by publish date and return the number
            that is configured in portal_properties.frontpage_properties.
        """

    def getLowArticles():
        """ Return the published articles with visibility `bottom` and that
            haven't expired. Sort by publish date and return the number
            that is configured in portal_properties.frontpage_properties.
        """


class ISubFolderView(Interface):
    """Marker interface for SubFolderView
    """

    def folder_contents(size_limit):
        """ Return the subfolder contents of the context folder """


class ISubFoldersListing(Interface):
    """Marker interface to indicate that SubFoldersViewlet should be enabled
    """

class ISmartView(Interface):
    """ Smart view """

    def getTemplateName():
        """ Template Name """

    def getTemplate():
        """ Template """

    def getListingMacro():
        """ Listing macro """


class ILanguages(Interface):
    """ Languages """

    def getTranslationLanguages():
        """ Return languages for translation. """

    def getTranslatedSitesLanguages():
        """ Return languages for translated sites.  """


class IBelowEditContentTitle(IViewletManager):
    """A viewlet manager that sits below the content title in edit templates
    """


class IAboveColumnsManager(IViewletManager):
    """A viewlet manager that sits above columns
    """
