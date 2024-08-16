from rest_framework.views import exception_handler

from datetime import datetime

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    
    # key = next(iter(exc.detail.keys()))
    # error_detail = exc.detail[key][0]
    
    print('*****')
    # print(error_detail)
    # print(error_detail.code)
    print(exc)
    print(context)
    print('*****')
    
    if response is not None:
        error_detail = None
        error_code = 'error'

        if isinstance(exc.detail, dict):
            key = next(iter(exc.detail.keys()))
            error_detail = exc.detail[key]
            if isinstance(error_detail, list):
                error_detail = error_detail[0]
        elif isinstance(exc.detail, list):
            error_detail = exc.detail[0]
        else:
            error_detail = exc.detail

        if hasattr(error_detail, 'code'):
            error_code = error_detail.code
    # if response is not None:
        response.data = {
            'statusCode': response.status_code,
            'errorCode': error_code,
            'message': error_detail.__str__(),
            'result': None,
            'timesstamp': datetime.now().isoformat()
        }

    return response