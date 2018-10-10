@extends('layouts.admin')

@section('title', 'Users')

@section('content')
    <div class="card">
        <header class="card-header">
            <p class="card-header-title">Users</p>
        </header>
        <div class="card-content">
            <table id="table-users">

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
            const datatable_users = $('#table-users').DataTable({
                processing: true,
                serverSide: true,
                ajax: {
                    url: '{!! route('admin.users.filter') !!}',
                    type: "POST"
                },
                searchDelay: 500,
                columns: [
                    {
                        data: "id",
                        title: "ID",
                    },
                    {
                        data: "name",
                        title: "Name",
                        render: function ( data, type, row ) {
                            return `
                                <img src="${row.avatar}" style="height: 25px">
                                ${row.steam_id ? '<a href="https://steamcommunity.com/profiles/'+row.steam_id+'" target="_blank">' : ''}
                                    ${data}
                                ${row.steam_id ? '</a>' : ''}
                                `;
                        }
                    },
                    {
                        data: "credits",
                        title: "Credits",
                        render: function (data) {
                            return `<input class="credits" type="number" value="${data}">`
                        }
                    },
                    {
                        searchable: false,
                        data: "is_admin",
                        title: "Is admin?",
                        render: function (data) {
                            return `<input class="is_admin" type="checkbox" value="1" ${data?'checked':''}>`
                        }
                    },
                    {
                        searchable: false,
                        sorting: false,
                        render: function (data, type, row) {
                            return `<button class="save-user" data-id="${row.id}">Save</button>`
                        }
                    },
                    {
                        data: "first_login_at",
                        title: "First login"
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

            $(document).on('click', '.save-user', function () {
                const row = $(this).closest('tr')
                const user_id = $(this).data('id')
                const credits = row.find('input.credits').val()
                const is_admin = row.find('input.is_admin')[0].checked ? 1 : 0

                $.ajax({
                    url: "{!! route('admin.users.save') !!}",
                    method: "POST",
                    data: {
                        id: user_id,
                        credits: credits,
                        is_admin: is_admin,
                    }
                })
                .always(function () {
                    datatable_users.ajax.reload();
                })
            })

        } );

    </script>
@endsection


