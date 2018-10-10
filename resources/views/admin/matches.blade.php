@extends('layouts.admin')

@section('title', 'Matches')

@section('content')
    <div class="card">
        <header class="card-header">
            <p class="card-header-title">Matches</p>
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
                    url: '{!! route('admin.matches.filter') !!}',
                    type: "POST"
                },
                searchDelay: 500,
                order: [[ 4, "desc" ]],
                columns: [
                    {
                        data: "id",
                        title: "ID",
                        render: function (data) {
                            return `<span class="match-id">${data}</span>`
                        }
                    },
                    {
                        data: "name",
                        title: "Name",
                        render: function (data, type, row) {
                            return `<strong>${data}</strong><br>L: ${row.series.league.name}`
                        }
                    },
                    {
                        data: "number_of_games",
                        title: "Best of",
                    },
                    {
                        data: "status",
                        title: "Status",
                    },
                    {
                        data: "begins_at",
                        title: "Begins at",
                    },
                    {
                        data: "hide",
                        title: "Hide",
                        render: function (data, type, row) {
                            return `<input class="match-hide" type="checkbox" value="1" ${data == 1 ? 'checked' : ''}>`
                        }
                    },
                    {
                        searchable: false,
                        sorting: false,
                        render: function (data, type, row) {
                            return `<button class="match-save">SAVE</button><button class="match-return">RETURN BETS</button>`
                        }
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

            $(document).on('click', '.match-save', function () {
                const row = $(this).closest('tr')
                const id = row.find('.match-id').text()
                const hide = row.find('.match-hide')[0].checked ? 1 : 0

                $.ajax({
                    url: "{!! route('admin.matches.save') !!}",
                    method: "POST",
                    data: {
                        id: id,
                        hide: hide
                    }
                })
                .always(function () {
                    datatable.ajax.reload();
                })
            })
            $(document).on('click', '.return-save', function () {
                const id = $(this).closest('tr').find('.match-id').text()

                $.ajax({
                    url: "{!! route('admin.matches.return') !!}",
                    method: "POST",
                    data: {
                        id: id,
                    }
                })
                .always(function () {
                    datatable.ajax.reload();
                })
            })

        } );

    </script>
@endsection


