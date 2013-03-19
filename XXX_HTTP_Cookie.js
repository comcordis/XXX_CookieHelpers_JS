
// address cookies via XXX_HTTP_Cookie.getVariable('name')

var XXX_HTTP_Cookie =
{
	restrictToSubDomain: true,	
	encodeValue: true,	
	expirationMethod: 'maxAge',
	valueSeparator: ',',
	
	supported: false,	
	tested: false,
	
	variables: [],
	
	initialize: function ()
	{
		var cookies = document.cookie.split('; ');
		for (var i = 0, iEnd = cookies.length; i < iEnd; ++i)
		{
			var cookiePair = cookies[i].split('=');
			this.variables[cookiePair[0]] = cookiePair[1];
		}
	},
	
	isSupported: function ()
	{
		var result = false;
		
		if (!this.tested)
		{
			result = this.testSupport();
		}
		else
		{
			result = this.supported;
		}
		
		return result;
	},
	
	testSupport: function ()
	{
		var result = false;
		
		if (this.supported)
		{
			result = true;
		}
		else
		{
			if (!this.tested)
			{
				// Official property
				result = navigator.cookieEnabled ? true : false;
				
				// Check by trial
				if (!result)
				{
					if (XXX_HTTP_Cookie.getVariable('cookieSupport'))
					{
						result = true;
					}
					else
					{
						if (XXX_HTTP_Cookie.getVariable('testCookie'))
						{
							XXX_HTTP_Cookie.setVariablePersistent('testCookie', 1);
						}
					
						if (XXX_HTTP_Cookie.getVariable('testCookie'))
						{
							XXX_HTTP_Cookie.deleteVariable('testCookie');
						
							XXX_HTTP_Cookie.setVariablePersistent('cookieSupport', 1, 315360000);
							
							result = true;
						}
					}
				}
				
				if (result)
				{
					this.supported = true;
				}
		
				this.tested = true;
			}
		}
		
		return result;
	},
	
	setVariableForSession: function (name, value, encryptedConnectionOnly, serverSideOnly, domain, path)
	{
		return this.setVariable(name, value, 0, encryptedConnectionOnly, serverSideOnly, domain, path);
	},
	
	setVariablePersistent: function (name, value, lifeTime, encryptedConnectionOnly, serverSideOnly, domain, path)
	{
		if (!XXX_Type.isPositiveInteger(lifeTime))
		{
			lifeTime = 31536000;
		}
		
		return this.setVariable(name, value, lifeTime, encryptedConnectionOnly, serverSideOnly, domain, path);
	},
		
	setVariable: function (name, value, lifeTime, encryptedConnectionOnly, serverSideOnly, domain, path)
	{
		if (XXX_Type.isValue(name) && XXX_Type.isInteger(lifeTime))
		{
			var timestamp = XXX_TimestampHelpers.getCurrentTimestamp();
			
			var endOfLifeTimestamp = timestamp + lifeTime;
			
				var tempDate = new Date();
				tempDate.setTime(endOfLifeTimestamp);
				
				var expiresFormatted = tempDate.toUTCString();
				
			var maxAge = lifeTime;
			
			if (!domain)
			{
				/*
				TODO
				var tempDomain = XXX_Domain.getDomain();
				
				domain = this.restrictToSubDomain ? tempDomain.cookieSubDomain : tempDomain.cookieDomain;*/
			}
			
			if (!path)
			{
				path = '/';
			}
			
			var header = '';
			header += name + '=';
			
			if (this.encodeValue)
			{
				// TODO
				header += value
			}
			else
			{
				header += value;				
			}
						
			if (domain)
			{
				header += '; Domain=' + domain;
			}
			
			if (path)
			{
				header += '; Path=' + path;
			}
			
			if (this.expirationMethod == 'maxAge')
			{
				header += '; Max-Age=' + maxAge;
			}
			else
			{
				header += '; Expires=' + expiresFormatted;
			}
			
			if (encryptedConnectionOnly)
			{
				header += '; Secure';
			}
			
			if (serverSideOnly)
			{
				header += '; HttpOnly';
			}
			
			document.cookie = result;
			
			this.variables[name] = value;
		}
	},
	
	getVariable: function (name)
	{
		var result = false;
		
		if (document.cookie.indexOf(name) != -1)
		{
			result = this.variables[name];
		}
		
		return result;
	},
		
	deleteVariable: function (name)
	{
		this.setVariable(name, '', -31536000);
		
		try
		{
			this.variables[name] = undefined;
			delete this.variables[name];
		}
		catch (exception)
		{
		}
	},
	
	reset: function ()
	{
		for (var name in this.variables)
		{
			this.deleteVariable(name);
		}
	}
};
