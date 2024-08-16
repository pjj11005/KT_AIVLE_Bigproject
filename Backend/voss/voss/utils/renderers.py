from rest_framework.renderers import JSONRenderer

from datetime import datetime

class CustomRenderer(JSONRenderer) :
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response_data = renderer_context.get('response')

        print("---------------")
        print(data)
        print(response_data)
        print(response_data.status_text)
        print("---------------")
        
        if response_data.status_code == 200:
            response = {
                'statusCode': response_data.status_code,
                'errorCode': 0,
                'message': response_data.status_text,
                'result': data,
                'timesstamp': datetime.now().isoformat()
            }
        # else:
        #     response = {
        #         'statusCode': response_data.status_code,
        #         'errorCode': response_data.status_code,
        #         'message': response_data.status_text,
        #         'result': None,
        #         'timesstamp': datetime.now().isoformat()
        #     }
        else:
            response = data

        return super(CustomRenderer, self).render(response, accepted_media_type, renderer_context)