import cherrypy

tools.staticfile.on = True
tools.staticfile.dir = ""

if __name__ == '__main__':
    cherrypy.quickstart(Root(), '/')