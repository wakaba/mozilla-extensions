#!/usr/bin/perl
use strict;
require Getopt::Long;
my %opt = (type => 'js');
Getopt::Long::GetOptions (
  'input=s'	=> \$opt{input},
  'output-type=s'	=> \$opt{type},
);

my %var = (percent => {value => '%'});
my $name;
while (<>) {
  if (/^(.+?)(?:\[([^]]+)\])?:\s*$/) {
    $name = $1;
    $var{$name}->{type} = $2;
  } elsif (/^\t(.*)/) {
    my $s = $1;
    $s =~ tr/\x0D\x0A//d;
    $s = replace_percent ($s, \%var);
    if ($var{$name}->{type} eq 'list') {
      push @{$var{$name}->{value}}, $s;
    } else {
      $var{$name}->{value} .= "\n" if defined $var{$name}->{value};
      $var{$name}->{value} .= $s;
    }
  }
}

open SRC, $opt{input} or die "$0: $opt{input}: $!";
  print scalar commentize (qq(This file is auto-generated (at @{[
                              sprintf '%04d-%02d-%02dT%02d:%02d:%02dZ',
                                      (gmtime)[5]+1900, (gmtime)[4]+1, (gmtime)[3,2,1,0]
                              ]}).\n)
                          .qq(Do not edit by hand!\n))
        unless $opt{type} eq 'xml';
  while (<SRC>) {
    print scalar escape (replace_percent ($_, \%var));
  }
close SRC;

exit;

sub escape ($) {
  my $s = shift;
  if ($opt{type} eq 'moz-properties') {
    require Encode;
    $s = Encode::decode ('utf8', $s);
    ## TODO: How to encode U+10000 - U-7F000000 ?
    $s =~ s/([^\x0A\x0D\x20-\x22\x24-\x5B\x5D-\x7E])/sprintf '\u%04X', ord $1/ge
      unless $s =~ /^\s*\#/;
  }
  $s;
}

sub replace_percent ($$) {
  my ($s, $l) = @_;
  $s =~ s{%%([^%]+)%%}{
    my ($r, $type) = _get_replacement_text ($1, $l);
    if ($type eq 'list') {
      $r = join (', ', map {qq("$_")} @$r);
    }
    $r;
  }ge;
  $s;
}

sub _get_replacement_text ($$) {
  my ($n, $l) = @_;
  my ($rm, $type) = ($l->{$n}->{value}, $l->{$n}->{type});
  unless (defined $rm) {
    if ($n eq 'current-date-time') {
      $rm = sprintf '%04d-%02d-%02dT%02d:%02d:%02dZ',
                    (gmtime)[5]+1900, (gmtime)[4]+1, (gmtime)[3,2,1,0]
    }
  }
  ($rm, $type);
}

sub commentize ($) {
  my $s = shift;
  if ($opt{type} eq 'js') {
    $s =~ s!^! * !mg;
    return "/*\n" . $s . " */\n";
  } elsif ($opt{type} eq 'xml') {
    $s =~ s!^!   - !mg;
    return "<!--\n" . $s . "   -->\n";
  } else { # moz-properties
    $s =~ s!^!## !mg;
    return $s."\n";
  }
}


=head1 LICENSE

Copyright 2003-2004 Wakaba <w@suika.fam.cx>.  All rights reserved.

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; see the file COPYING.  If not, write to
the Free Software Foundation, Inc., 59 Temple Place - Suite 330,
Boston, MA 02111-1307, USA.

=cut

## $Date: 2004/04/14 12:17:38 $
