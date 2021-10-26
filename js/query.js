$( '#blockchain' ).click(function() {
  $( '#blockchain' ).prop('disabled', true);
  $( '#blockchain' ).buttonLoader('start');
  $( '#blockchain_response' ).text( '' );
  d3.select( 'body' ).selectAll( 'table' ).remove();
  $.getJSON( host + ':' + port + '/chain', function( data ) {
    node_id = data.node_id;
    // delete the difficulty field (not necessary for information purposes)
    data.chain.forEach(function(v){ delete v.difficulty });
    d3.select( 'body' ).selectAll( 'div' )
      .data([data.chain])
      .append( 'table' )
      .call(recurse);
  }).fail(function () {
    $( '#blockchain_response' ).text( 'connection error. please retry.' );
  }).always(function () {
    $( '#blockchain' ).buttonLoader('stop');
    $( '#blockchain' ).prop('disabled', false);
  });
});

$( '#balance' ).click(function() {
  $( '#balance' ).prop('disabled', true);
  $( '#balance' ).buttonLoader('start');
  $( '#balance_response' ).text( '' );
  $.getJSON( host + ':' + port + '/utxo', function( data ) {
    node_id = data.node_id;
    balances = data;
    $( '#balance_response' ).text( JSON.stringify(data, null, 4).replace(/"(\w+)"\s*:/g, '$1:') );
    $( '#balance_response' ).attr('class', 'prettyprint');
    PR.prettyPrint();
  }).fail(function () {
    $( '#balance_response' ).text( 'connection error. please retry.' );
  }).always(function () {
    $( '#balance' ).buttonLoader('stop');
    $( '#balance' ).prop('disabled', false);
  });
});

$( '#transact' ).click(function() {
  if( !$( '#recipient' ).val() ) {
    $( '#transact_error' ).text( 'Please enter a recipient.' );
    return;
  }
  if( !$( '#amount' ).val() ) {
    $( '#transact_error' ).text( 'Please enter an amount.' );
    return;
  }
  $( '#transact_error' ).text( '' );
  $( '#transact' ).prop('disabled', true);
  $( '#transact' ).buttonLoader('start');
  $( '#transact_response' ).text( '' );
  $.ajax({
    method: "POST",
    contentType: "application/json",
    url: host + ':' + port + '/transactions/broadcast',
    data: JSON.stringify({ sender: node_id, recipient: $( '#recipient' ).val(), amount: $( '#amount' ).val()})
  }).done(function( data ) {
      $( '#transact_response' ).text( JSON.stringify(data, null, 4).replace(/"(\w+)"\s*:/g, '$1:') );
      $( '#transact_response' ).attr('class', 'prettyprint');
      PR.prettyPrint();
    }).fail(function () {
      $( '#transact_response' ).text( 'connection error. please retry.' );
    }).always(function () {
      $( '#transact' ).buttonLoader('stop');
      $( '#transact' ).prop('disabled', false);
    });
});

$( '#pending_transactions' ).click(function() {
  $( '#pending_transactions' ).prop('disabled', true);
  $( '#pending_transactions' ).buttonLoader('start');
  $( '#pending_transactions_response' ).text( '' );
  $.getJSON( host + ':' + port + '/transactions/pending', function( data ) {
    $( '#pending_transactions_response' ).text( JSON.stringify(data, null, 4).replace(/"(\w+)"\s*:/g, '$1:') );
    $( '#pending_transactions_response' ).attr('class', 'prettyprint');
    PR.prettyPrint();
  }).fail(function () {
    $( '#pending_transactions_response' ).text( 'connection error. please retry.' );
  }).always(function () {
    $( '#pending_transactions' ).buttonLoader('stop');
    $( '#pending_transactions' ).prop('disabled', false);
  });
});

$( '#mynetwork' ).click(function() {
  $( '#mynetwork' ).prop('disabled', true);
  $( '#mynetwork' ).buttonLoader('start');
  $( '#mynetwork_response' ).text( '' );
  $.ajax({
    method: "POST",
    contentType: "application/json",
    url: host + ':' + port + '/nodes/register',
    data: JSON.stringify({ nodes: [] })
  })
    .done(function( data ) {
      $( '#mynetwork_response' ).text( JSON.stringify(data, null, 4).replace(/"(\w+)"\s*:/g, '$1:') );
      $( '#mynetwork_response' ).attr('class', 'prettyprint');
      PR.prettyPrint();
    }).fail(function () {
      $( '#mynetwork_response' ).text( 'connection error. please retry.' );
    }).always(function () {
      $( '#mynetwork' ).buttonLoader('stop');
      $( '#mynetwork' ).prop('disabled', false);
    });
});

$( '#mine' ).click(function() {
  $( '#mine' ).prop('disabled', true);
  $( '#mine' ).buttonLoader('start');
  $( '#mine_response' ).text( '' );
  $.getJSON( host + ':' + port + '/mine', function( data ) {
    $( '#mine_response' ).text( JSON.stringify(data, null, 4).replace(/"(\w+)"\s*:/g, '$1:') );
    $( '#mine_response' ).attr('class', 'prettyprint');
    PR.prettyPrint();
  }).fail(function () {
    $( '#mine_response' ).text( 'connection error. please retry.' );
  }).always(function () {
    $( '#mine' ).buttonLoader('stop');
    $( '#mine' ).prop('disabled', false);
  });
});

$( '#consensus' ).click(function() {
  $( '#consensus' ).prop('disabled', true);
  $( '#consensus' ).buttonLoader('start');
  $( '#consensus_response' ).text( '' );
  $.getJSON( host + ':' + port + '/nodes/resolve', function( data ) {
    $( '#consensus_response' ).text( JSON.stringify(data, null, 4).replace(/"(\w+)"\s*:/g, '$1:') );
    $( '#consensus_response' ).attr('class', 'prettyprint');
    PR.prettyPrint();
  }).fail(function () {
    $( '#consensus_response' ).text( 'connection error. please retry.' );
  }).always(function () {
    $( '#consensus' ).buttonLoader('stop');
    $( '#consensus' ).prop('disabled', false);
  });
});

  $( '#difficulty' ).click(function() {
  $( '#difficulty' ).prop('disabled', true);
  $( '#difficulty' ).buttonLoader('start');
  $( '#difficulty_response' ).text( '' );
  $.getJSON( host + ':' + port + '/difficulty/broadcast?difficulty=' + $( '#difficulty_level' ).val(), function( data ) {
    $( '#difficulty_response' ).text( JSON.stringify(data, null, 4).replace(/"(\w+)"\s*:/g, '$1:') );
    $( '#difficulty_response' ).attr('class', 'prettyprint');
    PR.prettyPrint();
  }).fail(function () {
    $( '#difficulty_response' ).text( 'connection error. please retry.' );
  }).always(function () {
    $( '#difficulty' ).buttonLoader('stop');
    $( '#difficulty' ).prop('disabled', false);
  });
});

function recurse(sel) {
  // sel is a d3.selection of one or more empty tables
  sel.each(function(d) {
    // d is an array of objects
    var colnames,
        tds,
        table = d3.select(this);

    // if it's an object (but not array), convert to an array
    if ( (d instanceof Object) && !(d instanceof Array) ){
      d = [d];
    }

    // obtain column names by gathering unique key names in all 1st level objects
    // following method emulates a set by using the keys of a d3.map()
    colnames = d                                                          // array of objects
        .reduce(function(p,c) { return p.concat(d3.keys(c)); }, [])       // array with all keynames
        .reduce(function(p,c) { return (p.set(c,0), p); }, d3.map())      // map with unique keynames as keys
        .keys();                                                          // array with unique keynames (arb. order)

    // colnames array is in arbitrary order
    // sort colnames here if required

    // create header row using standard 1D data join and enter()
    table.append( 'thead' ).append( 'tr' ).selectAll( 'th' )
        .data(colnames)
        .enter().append( 'th' )
        .text(function(d) { return d; });

    // create the table cells by using nested 2D data join and enter()
    // see also http://bost.ocks.org/mike/nest/
    tds = table.append( 'tbody' ).selectAll( 'tr' )
        .data(d)                            // each row gets one object
      .enter().append( 'tr' ).selectAll( 'td' )
        .data(function(d) {                 // each cell gets one value
          return colnames.map(function(k) { // for each colname (i.e. key) find the corresponding value
            return d[k] || "";              // use empty string if key doesn't exist for that object
          });
        })
      .enter().append( 'td' );

    // cell contents depends on the data bound to the cell
    // fill with text if data is not an Array
    tds.filter(function(d) { return !(d instanceof Array) && !(d instanceof Object); })
        .text(function(d) { return d; });
    // fill with a new table if data is an Array
    tds.filter(function(d) { return (d instanceof Array) || (d instanceof Object); })
        .append( 'table' )
        .call(recurse);
    });
}

(function($) {
  $.fn.buttonLoader = function(action) {
    var self = $(this);
    //start loading animation
    if (action == 'start') {
      // if ($(self).attr("disabled") == "disabled") {
      //   e.preventDefault();
      // }
      //disable buttons when loading state
      // $('.has-spinner').attr("disabled", "disabled");
      $(self).attr('data-btn-text', $(self).text());
      //binding spinner element to button and changing button text
      $(self).html('<span class="spinner"><i class="fa fa-spinner fa-spin"></i></span> Loading');
      $(self).addClass('active');
    }
    //stop loading animation
    if (action == 'stop') {
      $(self).html($(self).attr('data-btn-text'));
      $(self).removeClass('active');
      //enable buttons after finish loading
      // $('.has-spinner').removeAttr("disabled");
    }
  }
})(jQuery);
