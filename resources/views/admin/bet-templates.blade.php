@extends('layouts.admin')

@section('title', 'Bet templates')

@section('content')
    <div class="card">
        <header class="card-header">
            <p class="card-header-title">Bet templates</p>
        </header>
        <div class="card-content">
            <table id="table-users">

            </table>
        </div>
        <footer class="card-footer">
            <form action="{{ route('admin.bet-templates.save') }}" method="post" style="width: 100%">
                <table class="dataTable no-footer" style="width: 100%">
                    <tr role="row">
                        <td><input class="template-type" name="type" type="number" value="1" min="1" required></td>
                        <td><input class="template-permap" name="permap" type="checkbox" value="1"></td>
                        <td><input class="template-minmaps" name="minmaps" type="number" value="1" min="1" required></td>
                        <td><input class="template-opens-before" name="opens_before" type="text" value="7d" required></td>
                        <td><button type="submit">ADD</button></td>
                    </tr>
                </table>
            </form>
        </footer>
    </div>
@endsection

@section('style')
    <link rel="stylesheet" href="//cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css">
@endsection
@section('script')
    <script src="//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>

    <script>
        $(document).ready( function () {
            const datatable_users = $('#table-users').DataTable({
                processing: true,
                serverSide: true,
                ajax: {
                    url: '{!! route('admin.bet-templates.filter') !!}',
                    type: "POST"
                },
                searchDelay: 500,
                columns: [
                    {
                        data: "id",
                        title: "ID",
                        render: function (data) {
                            return `<span class="template-id">${data}</span>`
                        }
                    },
                    {
                        data: "type",
                        title: "Type",
                        render: function (data) {
                            return `<input class="template-type" type="number" value="${data}" required>`
                        }
                    },
                    {
                        data: "permap",
                        title: "Per map",
                        render: function (data) {
                            return `<input class="template-permap" type="checkbox" value="1" ${data == 1 ? 'checked' : ''}>`
                        }
                    },
                    {
                        data: "minmaps",
                        title: "Min. maps",
                        render: function (data) {
                            return `<input class="template-minmaps" type="number" value="${data}" min="1" required>`
                        }
                    },
                    {
                        data: "opens_before",
                        title: "Opens before",
                        render: function (data) {
                            return `<input class="template-opens-before" type="text" value="${data}" required>`
                        }
                    },
                    {
                        searchable: false,
                        sorting: false,
                        render: function (data, type, row) {
                            return `<button class="template-save">SAVE</button>
                                    <button class="template-delete">DELETE</button>`
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
                    datatable_users.search(self.value).draw();
                }, datatable_users.context[0].searchDelay);
            });

            $(document).on('click', '.template-save', function () {
                const row = $(this).closest('tr')
                const id = row.find('.template-id').text()
                const type = row.find('.template-type').val()
                const minmaps = row.find('.template-minmaps').val()
                const opens_before = row.find('.template-opens-before').val()
                const permap = row.find('.template-permap')[0].checked ? 1 : 0

                $.ajax({
                    url: "{!! route('admin.bet-templates.save') !!}",
                    method: "POST",
                    data: {
                        id: id,
                        type: type,
                        permap: permap,
                        minmaps: minmaps,
                        opens_before: opens_before,
                    }
                })
                .always(function () {
                    datatable_users.ajax.reload();
                })
            })

            $(document).on('click', '.template-delete', function () {
                const id = $(this).closest('tr').find('.template-id').text()

                $.ajax({
                    url: "{!! route('admin.bet-templates.save') !!}",
                    method: "POST",
                    data: {
                        id: id,
                        delete: 1,
                    }
                })
                .always(function () {
                    datatable_users.ajax.reload();
                })
            })

        } );

    </script>
@endsection


