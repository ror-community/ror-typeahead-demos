var ROR_API_URL = "https://api.ror.org/v2/organizations?affiliation="

$('#simple-api .typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 3
  },
  {
    limit: 50,
    async: true,
    source: function (query, processSync, processAsync) {
        url = ROR_API_URL + encodeURIComponent(query);
        return $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (json) {
                orgs = json.items
                return processAsync(orgs);
            }
        });
    },
    templates: {
      pending: [
        '<div class="empty-message">',
          'Fetching organizations list',
        '</div>'
      ].join('\n'),
      suggestion: function (data) {
          var displayName = data.names.find(name => name.types.includes('ror_display'))?.value || '';
		  var orgType = data.types?.[0] ? data.types[0].charAt(0).toUpperCase() + data.types[0].slice(1) : '';
          var cityName = data.locations[0].geonames_details?.name || '';
          var countryName = data.locations[0].geonames_details?.country_name || '';
          
          return '<p>' + displayName + '<br><small>' + orgType + ' - ' + cityName + ', ' + countryName + '<br><i>'+ altNames + '</i></small></p>'; 
      }
    },
    display: function (data) {
      return data.names.find(name => name.types.includes('ror_display'))?.value || '';
    },
    value: function(data) {
      return data.id;
    }
});

$('#simple-api .typeahead').bind('typeahead:select', function(ev, suggestion) {
  $('#ror-id-01').val(suggestion.id);
});

var orgs = new Bloodhound({
  datumTokenizer: function(datum) {
    var tokens = [];
    // Extract display name
    var displayName = datum.names?.find(name => name.types.includes('ror_display'))?.value;
    if (displayName) tokens.push(displayName);
    
    // Extract all name values for tokenization
    if (datum.names) {
      datum.names.forEach(name => {
        if (name.value) tokens.push(name.value);
      });
    }
    
    return Bloodhound.tokenizers.whitespace(tokens.join(' '));
  },
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  local: ORGS
});

orgs.initialize();

$('#static-file  .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 3
},
{
  limit: 50,
  async: true,
  source: orgs,
  templates: {
    pending: [
      '<div class="empty-message">',
        'Fetching organizations list',
      '</div>'
    ].join('\n'),
    suggestion: function (data) {
        var displayName = data.names?.find(name => name.types.includes('ror_display'))?.value || '';
		var orgType = data.types?.[0] ? data.types[0].charAt(0).toUpperCase() + data.types[0].slice(1) : '';
        var cityName = data.locations[0].geonames_details?.name || '';
        var countryName = data.locations[0].geonames_details?.country_name || '';
          
        return '<p>' + displayName + '<br><small>' + orgType + ' - ' + cityName + ', ' + countryName + '<br><i>'+ altNames + '</i></small></p>'; 
    }
  },
  display: function (data) {
    return data.names?.find(name => name.types.includes('ror_display'))?.value || '';
  },
  value: function(data) {
    return data.id;
  }
});

$('#static-file .typeahead').bind('typeahead:select', function(ev, suggestion) {
  $('#ror-id-02').val(suggestion.id);
});