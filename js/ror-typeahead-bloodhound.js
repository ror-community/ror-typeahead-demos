var ROR_API_URL = "https://api.ror.org/v1/organizations?affiliation="

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
          return '<p><strong>' + data.organization.name + '</strong><br>' + data.organization.types[0] + ', ' + data.organization.country.country_name + '</p>';
      }
    },
    display: function (data) {
      return data.organization.name;
    },
    value: function(data) {
      return data.organization.identifier;
    }
});

$('#simple-api .typeahead').bind('typeahead:select', function(ev, suggestion) {
  $('#ror-id-01').val(suggestion.organization.id);
});

var orgs = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name', 'acronyms', 'aliases', 'labels'),
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
        return '<p><strong>' + data.name + '</strong><br>' + data.type + ', ' + data.country_name + '</p>';
    }
  },
  display: function (data) {
    return data.name;
  },
  value: function(data) {
    return data.identifier;
  }
});

$('#static-file .typeahead').bind('typeahead:select', function(ev, suggestion) {
  $('#ror-id-02').val(suggestion.id);
});