@extends('layouts.admin')

@section('title', 'Transactions - '.$type)

@section('content')
    <div class="card">
        <header class="card-header">
            <p class="card-header-title">Transactions - {{ $type }}</p>
        </header>
        <div class="card-content">
            <table id="table">

            </table>
        </div>
    </div>
@endsection

@section('style')
    <link rel="stylesheet" href="//cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css">
@endsection
@section('script')
    <script src="//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>

    <script>
        $(document).ready( function () {
            const datatable = $('#table').DataTable({
                processing: true,
                serverSide: true,
                ajax: {
                    url: '{!! route('admin.transactions.filter') !!}',
                    type: "POST",
                    data: {
                        type: '{{ $type }}'
                    }
                },
                searchDelay: 500,
                order: [[ 0, "desc" ]],
                columns: [
                    {
                        data: "id",
                        title: "ID"
                    },
                    {
                        data: "user_id",
                        title: "User",
                        render: function ( data, type, row ) {
                            return `
                                <img src="${row.user.avatar}" style="height: 25px; float: left">
                                ${row.user.steam_id ? '<a href="https://steamcommunity.com/profiles/'+row.user.steam_id+'" target="_blank">' : ''}
                                    ${row.user.name}<br><small>ID: <strong>${data}</strong></small>
                                ${row.user.steam_id ? '</a>' : ''}
                                `;
                        }
                    },
                    {
                        data: "offer",
                        title: "Offer",
                        render: function ( data, type, row ) {

                            let items = '{{ $type }}' == 'deposit' ? row.deposits : row.withdraws;
                            let output = `Offer ID: <strong>${data}</strong>`
                            if(items)
                                items.forEach(function (item) {
                                    output += '<br>' + item.name;
                                })
                            return output;
                        }
                    },
                    {
                        data: "credits",
                        title: "Credits",
                    },
                    {
                        data: "timestamp",
                        title: "Time",
                    }
                ]
            });

            //Prevent search on each keyup
            let input_filter_timeout;
            const serach_inpuit = $("div.dataTables_filter input[type='search']");
            serach_inpuit.unbind();
            serach_inpuit.on('keyup change', function() {
                const self = this
                clearTimeout(input_filter_timeout);
                input_filter_timeout = setTimeout(function() {
                    datatable.search(self.value).draw();
                }, datatable.context[0].searchDelay);
            });

        } );

    </script>
@endsection


